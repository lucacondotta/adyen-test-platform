# Adyen Test Platform

## Description

This is a simple node based platform that allows you to test Adyen payments. 

## Installation

1. Clone this repository
2. From the repository folder run `npm install`
3. Copy `.env.dist` file and name it `.env` and set inside this file all the required parameters
    * `ADYEN_API_KEY` (your Adyen API key)
    * `ADYEN_ORIGIN_KEY` (your Adyen Origin key for frontend components)
    * `ADYEN_API_CHECKOUT_BASE_URL` (API base url - See "Account > API URLs" section in your Adyen control panel)
    * `ADYEN_API_CHECKOUT_VERSION` (API version - See "Account > API URLs" section in your Adyen control panel and extract it from urls path)
    * `ADYEN_MERCHANT_ACCOUNT` (your Adyen merchant account identifier)  
    
    You can also provide a value for `PORT` parameter to set on which port the application will run on `localhost` 
4. Run application with `node index.js`
5. Go to `http://localhost:PORT` to start testing Adyen payments


