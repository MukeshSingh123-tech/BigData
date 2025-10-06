import streamlit as st
import joblib
import pandas as pd
import numpy as np

# Load the trained model
try:
    model = joblib.load('airbnb_price_model.joblib')
except FileNotFoundError:
    st.error("Model file 'airbnb_price_model.joblib' not found. Please ensure it is in the same directory.")
    st.stop()
    
# Get the feature names from the trained model
feature_order = model.feature_names_in_

# --- Streamlit UI Components ---
st.title("🏡 NYC Airbnb Price Predictor")
st.write("Enter the details of a hypothetical listing to get a price prediction.")

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.subheader("Listing Details")
    room_type = st.selectbox("Room Type", ['Entire home/apt', 'Private room', 'Shared room'])
    neighbourhood_group = st.selectbox("Neighbourhood Group", ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'])
    
    latitude = st.number_input("Latitude", value=40.7, format="%.5f")
    longitude = st.number_input("Longitude", value=-74.0, format="%.5f")
    minimum_nights = st.slider("Minimum Nights", 1, 365, 2)
    availability_365 = st.slider("Availability (out of 365 days)", 0, 365, 180)

with col2:
    st.subheader("Host & Review Details")
    number_of_reviews = st.number_input("Number of Reviews", value=25, min_value=0)
    reviews_per_month = st.number_input("Reviews Per Month", value=0.8, format="%.2f", min_value=0.0)
    calculated_host_listings_count = st.number_input("Host Listings Count", value=3, min_value=1)
    days_since_last_review = st.number_input("Days Since Last Review", value=90, min_value=0)


# --- Prediction Logic ---
if st.button("Predict Price"):
    # Create one-hot encoded features based on user input
    room_type_encoded = {
        'room_type_Private room': 1 if room_type == 'Private room' else 0,
        'room_type_Shared room': 1 if room_type == 'Shared room' else 0
    }
    
    neighbourhood_group_encoded = {
        'neighbourhood_group_Brooklyn': 1 if neighbourhood_group == 'Brooklyn' else 0,
        'neighbourhood_group_Manhattan': 1 if neighbourhood_group == 'Manhattan' else 0,
        'neighbourhood_group_Queens': 1 if neighbourhood_group == 'Queens' else 0,
        'neighbourhood_group_Staten Island': 1 if neighbourhood_group == 'Staten Island' else 0
    }

    # Create the input dictionary with all features
    input_features = {
        'latitude': latitude,
        'longitude': longitude,
        'minimum_nights': minimum_nights,
        'number_of_reviews': number_of_reviews,
        'reviews_per_month': reviews_per_month,
        'calculated_host_listings_count': calculated_host_listings_count,
        'availability_365': availability_365,
        'days_since_last_review': days_since_last_review,
        'is_popular_host': 1 if calculated_host_listings_count > 10 else 0,
        **room_type_encoded,
        **neighbourhood_group_encoded
    }
    
    # Create a DataFrame from the input dictionary, ensuring the correct feature order
    input_df = pd.DataFrame([input_features])
    input_df = input_df[feature_order]

    # Make the prediction
    predicted_price = model.predict(input_df)[0]
    st.success(f"The predicted price is: ${predicted_price:.2f}")