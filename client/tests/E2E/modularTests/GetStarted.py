from selenium.webdriver.common.by import By
import time

def GetStarted(driver):
    GetStartedBtn = driver.find_element(By.ID, "startCTA")
    print("Get Started Button Found")

    GetStartedBtn.click()
    print("Successful Get Started Click")