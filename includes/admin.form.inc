<?php

/**
 * @file
 * Admin callbacks for Islandora Critical Edition
 */

/**
 * Creates the admin form for islandora_critical_edition.
 *
 * @return array
 *   Islandora critical edition admin form.
 */
function austese_repository_admin($form, &$form_state) {
  global $base_url;
  $form['mongo_port'] = array(
    '#type' => 'textfield',
    '#title' => t('Mongo Port'),
    '#default_value' => variable_get('mongo_port', '27017'),
    '#size' => 15,
  );
  $form['mongo_host'] = array(
    '#type' => 'textfield',
    '#title' => t('Mongo Port'),
    '#default_value' => variable_get('mongo_host', 'localhost'),
    '#size' => 15,
  );
  $form['mongo_dbname'] = array(
    '#type' => 'textfield',
    '#title' => t('Mongo Database Name'),
    '#default_value' => variable_get('mongo_dbname', 'test'),
    '#size' => 15,
  );
  if (module_exists('collationtools')) {
    $form['mvd_server_url'] = array(
      '#type' => 'textfield',
      '#title' => t('URL of MVD server'),
      '#default_value' => variable_get('mvd_server_url', $base_url),
    );
    $form['austese_server_prefix'] = array(
      '#type' => 'radios',
      '#title' => t("Server type"),
      '#description' => t('Check with your sysadmin if unsure.'),
      '#options' => array('/calliope' => 'Tomcat', '' => 'Jetty'),
      '#default_value' => variable_get('austese_server_prefix', ''),
    );
  }
  return system_settings_form($form);
}
