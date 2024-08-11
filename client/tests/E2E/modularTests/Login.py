from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def Login(driver):
    wait = WebDriverWait(driver, 5)
    loginBtn = wait.until(EC.presence_of_element_located((By.ID, 'login-button')))  # Adjust locator strategy

    if(loginBtn):
        print("Login Button Found")

        
        import os
        print("Here")
        from selenium.webdriver.common.keys import Keys

        from dotenv import load_dotenv


        load_dotenv()
        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")

        username_field = driver.find_element(By.ID, 'login-username')
        password_field = driver.find_element(By.ID, 'login-password')
        username_field.send_keys(username)
        password_field.send_keys(password)
        password_field.send_keys(Keys.RETURN)

        print("Sent Login Credentials")

    else:
        print("No Login Button")