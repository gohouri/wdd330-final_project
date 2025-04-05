// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_VOTRE_CLE_SECRETE'); // Remplacer par ta clé secrète Stripe !
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// Crée la session de paiement
app.post('/create-checkout-session', async (req, res) => {
    const { fName, email } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Commande de ${fName}`,
                    },
                    unit_amount: 5000, // 50.00 USD
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:1408/success',
        cancel_url: 'http://localhost:1408/cancel',
    });

    res.json({ id: session.id });
});

// Routes succès ou annulation (optionnel pour test)
app.get('/success', (req, res) => res.send('Paiement réussi 🎉'));
app.get('/cancel', (req, res) => res.send('Paiement annulé ❌'));

// Lancer le serveur
app.listen(3000, () => console.log('Serveur lancé sur http://localhost:1408'));
