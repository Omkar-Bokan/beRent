"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Leads_1 = require("../controllers/Leads");
const router = express_1.default.Router();
router.route('/')
    .get(Leads_1.getAllLeads) // GET /api/leads - Get all leads
    .post(Leads_1.createLead); // POST /api/leads - Create a new lead
router.route('/:id')
    .get(Leads_1.getLeadById) // GET /api/leads/:id - Get a single lead by ID
    .put(Leads_1.updateLead); // PUT /api/leads/:id - Update an existing lead
exports.default = router;
