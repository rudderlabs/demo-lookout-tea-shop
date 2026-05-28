-- Snowflake setup for RudderStack Snowpipe Streaming destination
-- Workspace: Lookout Demo (RS)  |  Demo: SF Summit / Tea Leafs
-- Warehouse SF_SUMMIT_LOOKOUT is assumed to already exist.
--
-- Run as ACCOUNTADMIN (or any role with MANAGE GRANTS).
-- Replace <RSA_PUBLIC_KEY> with the base64-only public key (no PEM headers).

USE ROLE ACCOUNTADMIN;

-- 1. Database where RudderStack will land event tables.
CREATE DATABASE IF NOT EXISTS LOOKOUT_DEMO;

-- 2. Role for RudderStack.
CREATE ROLE IF NOT EXISTS RUDDERSTACK_ROLE;

-- 3. Grants on warehouse, database, and (future) schemas.
GRANT USAGE ON WAREHOUSE SF_SUMMIT_LOOKOUT TO ROLE RUDDERSTACK_ROLE;
GRANT USAGE ON DATABASE LOOKOUT_DEMO TO ROLE RUDDERSTACK_ROLE;
GRANT CREATE SCHEMA ON DATABASE LOOKOUT_DEMO TO ROLE RUDDERSTACK_ROLE;
GRANT ALL ON ALL SCHEMAS IN DATABASE LOOKOUT_DEMO TO ROLE RUDDERSTACK_ROLE;
GRANT ALL ON FUTURE SCHEMAS IN DATABASE LOOKOUT_DEMO TO ROLE RUDDERSTACK_ROLE;

-- 4. Service user with key-pair auth (no password).
CREATE USER IF NOT EXISTS RUDDERSTACK_USER
  RSA_PUBLIC_KEY = '<RSA_PUBLIC_KEY>'
  MUST_CHANGE_PASSWORD = FALSE
  DEFAULT_ROLE = RUDDERSTACK_ROLE
  DEFAULT_WAREHOUSE = SF_SUMMIT_LOOKOUT
  COMMENT = 'RudderStack Snowpipe Streaming service user for Lookout sf-demo workspace';

-- 5. Bind role to user.
GRANT ROLE RUDDERSTACK_ROLE TO USER RUDDERSTACK_USER;
