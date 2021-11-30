import nodemailer from 'nodemailer'

interface MailerI{
    to: string
    subject: string
    text: string
    html: string
}

export async function Mailer({to, subject, text, html}: MailerI){
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "aecedad2966c88",
            pass: "abe29586b53fd9"
        }
    })

    await transporter.sendMail({
        from: '"Luby cash" <luby@cash.com>',
        to,
        subject,
        text,
        html
    })
}