-- Requests live only as GitHub issues now. Existing rows were test data.
-- Attachments stay in the request-files bucket; the object path is the stable id.

drop table public.request_files;
drop table public.requests;
