Feature: WebXr Spike

    Spike to prove that WebXr can be run using the Meta Quest and confirm other asumptions

    Background:
        Given That the user is on the Meta Quest 2

    @spike @manualtesting @1
    Scenario: Loading webXR through quest browser
        Given I have configured the meta quest
        And I have opened Quest Browser
        When I load a webXr based browser
        Then the meta quest should support the use of webXr

    @spike @manualtesting
    Scenario Outline: Launch spike through firebase host
        Given I have loaded Quest Browser
        When I load the <Firebase> url
        Then the meta quest should load the spike

        Examples:
            | Firebase                          |
            | https://oculus-3d-render.web.app/ |

    @spike @manualtesting
    Scenario Outline: Meta Quest controlls interact with spike
        Given I have loaded the Quest Browser
        And I have loaded the firebase host
        When I use the <OculusControlls>
        Then the spike model should respond

        Examples:
            | OculusControlls |
            | "Left Trigger"  |
            | "Right Trigger" |
            | "Pointer"       |

    @spike @manualtesting
    Scenario: Spike responsitivity
        Given I have loaded the Quest Browser
        And I have loaded the firebase host
        When I interact with the model using quest controlls
        And I adjust the view port
        Then there should be no notiecable lag
        And the meta quest should handle the loading locally

    @spike @manualtesting
    Scenario: Quest can enter virtual reality mode
        Given I have loaded the Quest Browser
        And I have loaded the firebase host
        When I click the enter vr mode
        Then the quest should enter the vr mode