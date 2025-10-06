import streamlit as st
import pandas as pd
import joblib
import xgboost

# --- 1. Load the Trained Model and Feature Order ---
@st.cache_resource
def load_model():
    """Loads the pre-trained model and feature names from the joblib file."""
    try:
        model = joblib.load("airbnb_price_model.joblib")
        return model
    except FileNotFoundError:
        st.error("Model file 'airbnb_price_model.joblib' not found. Please ensure it is in the same directory.")
        st.stop()

model = load_model()

# Assuming your model object has a list of feature names from training
feature_order = model.get_booster().feature_names

# --- 2. Build the Frontend UI ---
st.set_page_config(page_title="NYC Airbnb Price Predictor", layout="wide")
st.title("🏡 NYC Airbnb Price Predictor")
st.write("Enter the details of a hypothetical listing to get a price prediction.")

col1, col2, col3 = st.columns(3)

with col1:
    st.header("Location & Listing Info")
    latitude = st.number_input("Latitude", value=40.75, format="%.4f")
    longitude = st.number_input("Longitude", value=-73.98, format="%.4f")
    neighbourhood_group = st.selectbox("Neighbourhood Group",
                                       ("Manhattan", "Brooklyn", "Queens", "Staten Island", "Bronx"))
    room_type = st.selectbox("Room Type",
                             ("Entire home/apt", "Private room", "Shared room"))

with col2:
    st.header("Booking & Review Stats")
    minimum_nights = st.number_input("Minimum Nights", min_value=1, value=2)
    number_of_reviews = st.number_input("Number of Reviews", min_value=0, value=25)
    reviews_per_month = st.number_input("Reviews Per Month", min_value=0.0, value=0.8, format="%.2f")
    days_since_last_review = st.number_input("Days Since Last Review", min_value=0, value=90)

with col3:
    st.header("Host & Availability")
    calculated_host_listings_count = st.number_input("Host Listings Count", min_value=1, value=3)
    availability_365 = st.number_input("Availability (out of 365 days)", min_value=0, max_value=365, value=180)
    is_popular_host = st.checkbox("Is a Popular Host (10+ listings)")
    is_popular_host = 1 if is_popular_host else 0

# --- 3. Make Prediction on Button Click ---
if st.button("Predict Price"):
    # Create a dictionary for the input features
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
        'neighbourhood_group_Brooklyn': 1 if neighbourhood_group == 'Brooklyn' else 0,
        'neighbourhood_group_Manhattan': 1 if neighbourhood_group == 'Manhattan' else 0,
        'neighbourhood_group_Queens': 1 if neighbourhood_group == 'Queens' else 0,
        'neighbourhood_group_Staten Island': 1 if neighbourhood_group == 'Staten Island' else 0,
        'room_type_Private room': 1 if room_type == 'Private room' else 0,
        'room_type_Shared room': 1 if room_type == 'Shared room' else 0
    }

    # Create a DataFrame with the correct feature order
    input_df = pd.DataFrame([input_features])[feature_order]

    # Make a prediction
    prediction = model.predict(input_df)[0]
    predicted_price = f"${prediction:.2f}"

    # Display the result to the user
    st.success(f"The predicted price is: **{predicted_price}**")