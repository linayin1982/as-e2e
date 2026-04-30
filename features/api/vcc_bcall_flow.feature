@c3
Feature: Softcar C3 service flow
  To validate the softcar integration end to end
  As an API test suite
  I want to create, update, and terminate a softcar service using BDD steps

  Scenario: Complete the default BCALL flow
    Given the default "BCALL" service request data for "VCC" vehicle
    When mock a start request
    Then the service is created successfully
    When mock an update request
    Then the position update is accepted
    When mock a terminate request
    Then the termination acknowledgement is accepted

