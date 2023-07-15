// src/mocks/handlers.js
import { rest } from "msw";
import { handlers as BoostTestHandlers } from "./handlers/boost_test_handlers";
import { handlers as ContentTestHandlers } from "./handlers/content_test_handlers";
import { handlers as ImportTestHandlers } from "./handlers/importer_test_handlers";
import { handlers as WhatsonchainTestHandlers } from "./handlers/whatsonchain_test_handlers";
import { handlers as BoostJobsTestHandlers } from "./handlers/boost_jobs_test_handlers";
import { handlers as BoostProofsTestHandlers } from "./handlers/boost_proofs_test_handlers";
import { handlers as TransactionTestHandlers } from "./handlers/transactions_test_handlers";
import { handlers as UnspentTestHandlers } from "./handlers/unspent_handlers";
export const handlers = [
    ...BoostTestHandlers,
    ...ContentTestHandlers,
    ...ImportTestHandlers,
    ...WhatsonchainTestHandlers,
    ...BoostJobsTestHandlers,
    ...BoostProofsTestHandlers,
    ...TransactionTestHandlers,
    ...UnspentTestHandlers
];
