*** Settings ***

Library    SeleniumLibrary
Suite Setup    Set Screenshot Directory   output/screenshots

Resource    ../resources/variables.robot
Resource    ../resources/keywords.robot

*** Test Cases ***

Login Test
    [Tags]    login
    [Documentation]    This test case verifies the login functionality of the application.
    Open Login Page
    Login
    [Teardown]    Close Browser


Logout Test
    [Tags]    logout
    [Documentation]    This test case verifies the logout functionality of the application.
    Open Login Page
    Login
    Logout
    [Teardown]    Close Browser


Event Functions Test
    [Tags]    events
    [Documentation]    This test case verifies the event CRUD functionality of the application.
    Open Login Page
    Login
    Select view    ${MONTH_VIEW_SELECTOR_XPATH}
    ${date}    Get Current Date    result_format=%Y-%m-%d
    Create Event    ${date}   Test Event Title    test group 1   Test Event Description
    Update Event    ${date}   Test Event Title    Updated Event Title
    Delete Event    ${date}   Updated Event Title
    [Teardown]    Close Browser


Group Functions Test
    [Tags]    groups
    [Documentation]    This test case verifies the group CRUD functionality of the application.
    Open Login Page
    Login
    Go To Menu    ${GROUPS_BUTTON_XPATH}
    Create Group    New Group    New Group Description
    Edit Group    New Group    Edited Group Name
    Delete Group    Edited Group Name
    [Teardown]    Close Browser









