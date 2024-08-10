from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def Authenticate(driver):
    wait = WebDriverWait(driver, 5)
    print("here")
    GetStartedBtn = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="auth-accept"]')))
    print("Agree Button Found")

    GetStartedBtn.click()
    print("Successful Agreement Click")
