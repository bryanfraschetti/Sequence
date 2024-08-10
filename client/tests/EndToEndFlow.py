from modularTests import OpenConnection, GetStarted, Login, Authenticate
from selenium import webdriver

driver = webdriver.Chrome()

try:
    OpenConnection.OpenConnection(driver)

    GetStarted.GetStarted(driver)

    Login.Login(driver)

    Authenticate.Authenticate(driver)

    breakpoint()

except:
    breakpoint()

finally:
    driver.quit()