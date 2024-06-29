--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-06-28 22:04:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3356 (class 1262 OID 24577)
-- Name: aiqtesttwodb; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE aiqtesttwodb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE aiqtesttwodb OWNER TO admin;

\connect aiqtesttwodb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

--CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24579)
-- Name: image_data; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.image_data (
    id integer NOT NULL,
    depth double precision NOT NULL,
    pixels bytea
);


ALTER TABLE public.image_data OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 24578)
-- Name: image_data_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.image_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.image_data_id_seq OWNER TO admin;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 215
-- Name: image_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.image_data_id_seq OWNED BY public.image_data.id;


--
-- TOC entry 3203 (class 2604 OID 24582)
-- Name: image_data id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.image_data ALTER COLUMN id SET DEFAULT nextval('public.image_data_id_seq'::regclass);


--
-- TOC entry 3350 (class 0 OID 24579)
-- Dependencies: 216
-- Data for Name: image_data; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 215
-- Name: image_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.image_data_id_seq', 1, false);


--
-- TOC entry 3205 (class 2606 OID 24586)
-- Name: image_data image_data_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.image_data
    ADD CONSTRAINT image_data_pkey PRIMARY KEY (id);


-- Completed on 2024-06-28 22:04:51

--
-- PostgreSQL database dump complete
--

