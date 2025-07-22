import { sendOtp, verifyOtp } from '../controllers/Authcontroller';
import Lead from '../model/user';
import express, { Request, Response } from 'express';



const router = express.Router();


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post('/', (req, res) => {
  const data = req.body;
  const lead = new Lead(req.body);
  const savedLead = lead.save();
  res.status(201).json(savedLead);
  console.log('Lead received:', data);
  res.status(201).json({ message: 'Lead created successfully' });
});

router.get('/', async (req, res) => {
  res.json({ message: 'GET /api working!' });
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // your logic here
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    res.status(200).json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
