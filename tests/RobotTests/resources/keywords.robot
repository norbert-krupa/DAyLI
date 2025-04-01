*** Settings ***

Library        SeleniumLibrary
Library        DateTime
Library    String
Resource       ../resources/variables.robot

*** Keywords ***


Open Login Page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be    DAyLI


Login
    Input Text    ${EMAIL_FIELD_XPATH}   ${EMAIL}
    Input Text    ${PASSWORD_FIELD_XPATH}   ${PASSWORD}
    Click Element    ${LOGIN_BUTTON_XPATH}
    Wait Until Element Is Visible    ${HEADER_XPATH}    timeout=10s
    Sleep    2s
    Reload Page
    Wait Until Element Is Visible    ${HEADER_XPATH}    timeout=10s
    Sleep    2s
    Element Text Should Be    ${HEADER_TEXTAREA_XPATH}    ${USERNAME}
    

Logout
    Click Element    ${LOGOUT_BUTTON_XPATH}
    Wait Until Element Is Visible    ${LOGIN_BUTTON_XPATH}    timeout=10s


Select view
    [Arguments]    ${view_xpath}
    Click Element    ${view_xpath}


Go To Menu
    [Arguments]    ${menu_xpath}
    Click Element    ${menu_xpath}
    Wait Until Element Is Visible    ${GROUPS_MENU_TITLE_XPATH}    timeout=10s
    Element Text Should Be    ${GROUPS_MENU_TITLE_XPATH}    My Groups


Clear Text
    [Arguments]    ${locator}    ${text}
    ${length}    Get Length    ${text}
    Click Element    ${locator}
    FOR    ${i}    IN RANGE    ${length}
        Press Keys    ${locator}    BACKSPACE
    END


Create Event
    [Arguments]    ${date}    ${title}   ${group}   ${description}
    ${DATE_XPATH}    Replace String    ${DATE_CELL_XPATH}    placeholder    ${date}
    Click Element    ${DATE_XPATH}
    Wait Until Element Is Visible    ${EVENT_TITLE_XPATH}    timeout=10s
    Input Text    ${EVENT_TITLE_XPATH}    ${title}
    Click Element    ${EVENT_GROUP_DROPDOWN_XPATH}
    Wait Until Element Is Visible    ${EVENT_GROUP_OPTIONS_XPATH}    timeout=10s
    ${GROUP_OPTION_XPATH}    Replace String    ${EVENT_GROUP_OPTION_XPATH}    placeholder    ${group}
    Click Element    ${GROUP_OPTION_XPATH}
    Input Text    ${EVENT_DESCRIPTION_XPATH}    ${description}
    Click Element   ${CREATE_BUTTON_XPATH}
    Sleep    2s
    Element Should Contain    ${DATE_XPATH}    ${title}


Update Event
    [Arguments]    ${date}    ${current_title}    ${new_title}
    ${EVENT_XPATH}    Replace String    ${EVENT_BLOCK_XPATH}    placeholder    ${current_title}
    Click Element    ${EVENT_XPATH}
    ${DETAILS_MODAL_XPATH}    Replace String    ${DETAILS_MODAL_XPATH}    placeholder    ${current_title}
    Wait Until Element Is Visible    ${DETAILS_MODAL_XPATH}    timeout=10s
    Click Element   ${EDIT_EVENT_BUTTON_XPATH}
    Wait Until Element Is Visible    ${EVENT_TITLE_XPATH}    timeout=10s
    Clear Text    ${EVENT_TITLE_XPATH}    ${current_title}
    Input Text    ${EVENT_TITLE_XPATH}    ${new_title}
    Click Element   ${SAVE_BUTTON_XPATH}
    Sleep    2s
    ${DATE_XPATH}    Replace String    ${DATE_CELL_XPATH}    placeholder    ${date}
    Element Should Contain    ${DATE_XPATH}    ${new_title}


Delete Event
    [Arguments]    ${date}    ${title}
    ${EVENT_XPATH}    Replace String    ${EVENT_BLOCK_XPATH}    placeholder    ${title}
    Click Element    ${EVENT_XPATH}
    ${DETAILS_MODAL_XPATH}    Replace String    ${DETAILS_MODAL_XPATH}    placeholder    ${title}
    Wait Until Element Is Visible    ${DETAILS_MODAL_XPATH}    timeout=10s
    Click Element   ${DELETE_EVENT_BUTTON_XPATH}
    ${CONFIRM_DELETE_MODAL_XPATH}    Replace String    ${CONFIRM_DELETE_MODAL_XPATH}    placeholder    ${title}
    Wait Until Element Is Visible    ${CONFIRM_DELETE_MODAL_XPATH}    timeout=10s
    Click Element   ${CONFIRM_DELETE_BUTTON_XPATH}
    Sleep    2s
    ${DATE_XPATH}    Replace String    ${DATE_CELL_XPATH}    placeholder    ${date}
    Element Should Not Contain    ${DATE_XPATH}    ${title}


Create Group
    [Arguments]    ${name}    ${description}
    Click Element    ${ADD_GROUP_BUTTON_XPATH}
    Wait Until Element Is Visible    ${GROUP_NAME_XPATH}    timeout=10s
    Input Text    ${GROUP_NAME_XPATH}    ${name}
    Input Text    ${GROUP_DESCRIPTION_XPATH}    ${description}
    Click Element   ${CREATE_BUTTON_XPATH}
    Sleep    2s
    ${GROUPS_LIST_ELEMENT_XPATH}    Replace String    ${GROUPS_LIST_ELEMENT_XPATH}    placeholder    ${name}
    Page Should Contain Element    ${GROUPS_LIST_ELEMENT_XPATH}


Edit Group
    [Arguments]    ${current_name}    ${new_name}
    ${EDIT_GROUP_BUTTON_XPATH}    Replace String    ${EDIT_GROUP_BUTTON_XPATH}    placeholder    ${current_name}
    Click Element    ${EDIT_GROUP_BUTTON_XPATH}
    Wait Until Element Is Visible    ${GROUP_NAME_XPATH}    timeout=10s
    Clear Text    ${GROUP_NAME_XPATH}    ${current_name}
    Input Text    ${GROUP_NAME_XPATH}    ${new_name}
    Click Element   ${SAVE_BUTTON_XPATH}
    Sleep    2s
    ${GROUPS_LIST_ELEMENT_XPATH}    Replace String    ${GROUPS_LIST_ELEMENT_XPATH}    placeholder    ${new_name}
    Page Should Contain Element    ${GROUPS_LIST_ELEMENT_XPATH}


Delete Group
    [Arguments]    ${name}
    ${DELETE_GROUP_BUTTON_XPATH}    Replace String    ${DELETE_GROUP_BUTTON_XPATH}    placeholder    ${name}
    Click Element    ${DELETE_GROUP_BUTTON_XPATH}
    ${CONFIRM_DELETE_MODAL_XPATH}    Replace String    ${CONFIRM_DELETE_MODAL_XPATH}    placeholder    ${name}
    Wait Until Element Is Visible    ${CONFIRM_DELETE_MODAL_XPATH}    timeout=10s
    Click Element   ${CONFIRM_DELETE_BUTTON_XPATH}
    Sleep    2s
    ${GROUPS_LIST_ELEMENT_XPATH}    Replace String    ${GROUPS_LIST_ELEMENT_XPATH}    placeholder    ${name}
    Page Should Not Contain Element    ${GROUPS_LIST_ELEMENT_XPATH}

    

    

    



    
    
    
    




