--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- Name: snapshot_trigger_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.snapshot_trigger_enum AS ENUM (
    'RANDOM_SNAPSHOT',
    'LESSON_WATCH',
    'QUIZ_ATTEMPT'
);


ALTER TYPE public.snapshot_trigger_enum OWNER TO postgres;

--
-- Name: supervisor_decision_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.supervisor_decision_enum AS ENUM (
    'OVERRIDE_PASS',
    'CONFIRM_FAIL'
);


ALTER TYPE public.supervisor_decision_enum OWNER TO postgres;

--
-- Name: verification_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_status_enum AS ENUM (
    'PASSED',
    'MISMATCH',
    'MULTIPLE_FACES',
    'NO_FACE_DETECTED',
    'SPOOF_DETECTED'
);


ALTER TYPE public.verification_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    action character varying(100),
    actor_id uuid,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id uuid
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: trainees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    trainee_id character varying(50) NOT NULL,
    name character varying(255),
    master_photo_url text,
    face_embedding public.vector(512),
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trainees OWNER TO postgres;

--
-- Name: verification_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    verification_id uuid,
    reviewed_by_supervisor_id uuid,
    supervisor_decision public.supervisor_decision_enum,
    supervisor_comments text,
    reviewed_at timestamp without time zone,
    CONSTRAINT chk_override_comment CHECK (((supervisor_decision <> 'OVERRIDE_PASS'::public.supervisor_decision_enum) OR ((supervisor_comments IS NOT NULL) AND (TRIM(BOTH FROM supervisor_comments) <> ''::text))))
);


ALTER TABLE public.verification_reviews OWNER TO postgres;

--
-- Name: visual_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visual_verifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    trainee_id character varying(50),
    session_id uuid,
    snapshot_url text,
    captured_at timestamp(3) without time zone,
    gps_lat numeric(9,6),
    gps_long numeric(9,6),
    faces_detected_count integer,
    liveness_score double precision,
    is_liveness_passed boolean,
    matched_confidence_score double precision,
    verification_status public.verification_status_enum,
    is_flagged boolean,
    trigger_type public.snapshot_trigger_enum,
    processing_time_ms integer
);


ALTER TABLE public.visual_verifications OWNER TO postgres;

--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: trainees trainees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_pkey PRIMARY KEY (id);


--
-- Name: trainees trainees_trainee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_trainee_id_key UNIQUE (trainee_id);


--
-- Name: verification_reviews verification_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_reviews
    ADD CONSTRAINT verification_reviews_pkey PRIMARY KEY (id);


--
-- Name: visual_verifications visual_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visual_verifications
    ADD CONSTRAINT visual_verifications_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_actor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_actor ON public.audit_logs USING btree (actor_id);


--
-- Name: idx_audit_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_created ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_tenant ON public.audit_logs USING btree (tenant_id);


--
-- Name: idx_face_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_face_embedding ON public.trainees USING ivfflat (face_embedding public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_trainees_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trainees_tenant ON public.trainees USING btree (tenant_id);


--
-- Name: idx_vv_is_flagged; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vv_is_flagged ON public.visual_verifications USING btree (is_flagged);


--
-- Name: idx_vv_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vv_session_id ON public.visual_verifications USING btree (session_id);


--
-- Name: idx_vv_trainee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vv_trainee_id ON public.visual_verifications USING btree (trainee_id);


--
-- Name: visual_verifications fk_trainee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visual_verifications
    ADD CONSTRAINT fk_trainee FOREIGN KEY (trainee_id) REFERENCES public.trainees(trainee_id);


--
-- Name: verification_reviews fk_verification; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_reviews
    ADD CONSTRAINT fk_verification FOREIGN KEY (verification_id) REFERENCES public.visual_verifications(id);


--
-- PostgreSQL database dump complete
--

