*** Settings ***

Library    SeleniumLibrary
Library    DateTime


*** Variables ***

${URL}                https://mycalendarapp-frontend.onrender.com
${BROWSER}            Chrome
${USERNAME}           APITester
${EMAIL}              apitesteremail@gmail.com      
${PASSWORD}           APITestP@ss1

${EMAIL_FIELD_XPATH}        xpath=//input[@id="outlined-basic" and @type="text"]
${PASSWORD_FIELD_XPATH}     xpath=//input[@id="outlined-adornment-password" and @type="password"]
${LOGIN_BUTTON_XPATH}       xpath=//button[@type="submit" and normalize-space(text())="Login"]
${LOGOUT_BUTTON_XPATH}      xpath=//div[@role="button" and .//span[normalize-space(text())="Logout"]]
${GROUPS_BUTTON_XPATH}       xpath=//a[.//span[normalize-space(text())="Groups"]]


${HEADER_XPATH}             xpath=//div[contains(@class, "MuiToolbar-root")]
${HEADER_TEXTAREA_XPATH}      xpath=//div[contains(@class, "MuiTypography-h6")]
${GROUPS_MENU_TITLE_XPATH}    xpath=//h4[normalize-space(text())="My Groups"]


${MONTH_VIEW_SELECTOR_XPATH}    xpath=//button[@type="button" and @title="month view" and normalize-space(text())="month"]
${DATE_CELL_XPATH}        xpath=//td[@role="gridcell" and @data-date="placeholder"]
${EVENT_BLOCK_XPATH}    xpath=//div[contains(@class, "fc-event-main") and contains(normalize-space(), "placeholder")]

${DETAILS_MODAL_XPATH}    xpath=//div[contains(@class, "MuiBox-root") and @tabindex="-1"][.//h5[normalize-space(.)="placeholder"]]
${CONFIRM_DELETE_MODAL_XPATH}    xpath=//div[contains(@class, "MuiBox-root") and @tabindex="-1"][.//h6[normalize-space(.)='Are you sure you want to delete "placeholder"?']]


${EVENT_TITLE_XPATH}         xpath=//input[@id="outlined-basic" and @name="title"]
${EVENT_GROUP_DROPDOWN_XPATH}      xpath=//div[@role="combobox" and @id="mui-component-select-group"]
${EVENT_GROUP_OPTIONS_XPATH}   xpath=//ul[@role="listbox"]
${EVENT_GROUP_OPTION_XPATH}   xpath=//ul[@role="listbox"]//li[normalize-space(.)="placeholder"]
${EVENT_DESCRIPTION_XPATH}   xpath=//textarea[@id="outlined-multiline-static"]

${GROUP_NAME_XPATH}    xpath=//input[@id="outlined-basic" and @name="name"]
${GROUP_DESCRIPTION_XPATH}    xpath=//textarea[@id="outlined-multiline-static" and @name="description"]

${CREATE_BUTTON_XPATH}       xpath=//button[@type="submit" and normalize-space(text())="Create"]
${EDIT_EVENT_BUTTON_XPATH}       xpath=//button[@type="button" and .//text()[normalize-space()="Edit"]]
${DELETE_EVENT_BUTTON_XPATH}       xpath=//button[@type="button" and .//text()[normalize-space()="Delete"]]
${SAVE_BUTTON_XPATH}    xpath=//button[@type="submit" and normalize-space(text())="Save"]
${CONFIRM_DELETE_BUTTON_XPATH}    xpath=//button[@type="button" and .//text()[normalize-space()="Yes"]]
${ADD_GROUP_BUTTON_XPATH}    xpath=//button[@aria-label="add-group"]
${EDIT_GROUP_BUTTON_XPATH}    xpath=//div[contains(@class, "MuiBox-root") and contains(@class, "css-1ono1ud")][.//h6[normalize-space(text())="placeholder"]]//button[@aria-label="edit"]
${DELETE_GROUP_BUTTON_XPATH}    xpath=//div[contains(@class, "MuiBox-root") and contains(@class, "css-1ono1ud")][.//h6[normalize-space(text())="placeholder"]]//button[@aria-label="delete"]


${GROUPS_LIST_ELEMENT_XPATH}    xpath=//div[contains(@class, "MuiBox-root") and contains(@class, "css-1ono1ud")][.//h6[normalize-space(text())="placeholder"]]





