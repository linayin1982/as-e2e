@c3
Feature: Softcar C3 service flow
  To validate the softcar integration end to end
  As an API test suite
  I want to create, update, and terminate a softcar service using BDD steps

  Scenario: Complete the default softcar C3 flow
    Given the default C3 softcar request data
    When I start the softcar service towards "C3"
    Then the service is created successfully
    When I send the softcar position update towards "C3"
    Then the position update is accepted
    When I terminate the softcar service towards "C3" with reason "cancelledInVehicle"
    Then the termination acknowledgement is accepted

