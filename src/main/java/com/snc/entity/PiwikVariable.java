package com.snc.entity;

public class PiwikVariable {

    public PiwikVariable() {
    }

    public PiwikVariable(String name, String value) {
        this.name = name;
        this.value = value;
    }

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column piwik_variable.name
     *
     * @mbggenerated
     */
    private String name;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column piwik_variable.value
     *
     * @mbggenerated
     */
    private String value;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column piwik_variable.name
     *
     * @return the value of piwik_variable.name
     *
     * @mbggenerated
     */
    public String getName() {
        return name;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column piwik_variable.name
     *
     * @param name the value for piwik_variable.name
     *
     * @mbggenerated
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column piwik_variable.value
     *
     * @return the value of piwik_variable.value
     *
     * @mbggenerated
     */
    public String getValue() {
        return value;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column piwik_variable.value
     *
     * @param value the value for piwik_variable.value
     *
     * @mbggenerated
     */
    public void setValue(String value) {
        this.value = value == null ? null : value.trim();
    }
}