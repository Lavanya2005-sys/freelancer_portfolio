import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { name, email, message } = req.body;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'lavanya.gurrampati5@gmail.com',
            subject: 'New Client Inquiry',
            html: `<p><b>${name}</b> (${email}) says:<br/>${message}</p>`,
        });

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
}