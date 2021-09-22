const express = require("express");
const bodyParser = require("body-parser");
const { check } = require("email-existence");
const client = require("@mailchimp/mailchimp_marketing");
const phoneVerify = require("google-libphonenumber");
const phoneUtil = phoneVerify.PhoneNumberUtil.getInstance();
const PNF = phoneVerify.PhoneNumberFormat;
const { customList } = require("country-codes-list");
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

client.setConfig({
    apiKey: '6bb1c5f44f13466f606092b33b099bd5-us5',
    server: 'us5'
});

var error = "";

router.get("/", (req, res) => {
    res.render("subscribe", {
        title: "Subscribe to our Newsletter - Visbanking",
        path: "/subscribe", 
        error: error
    });
    error = "";
});

router.post("/", (req, res) => {
    const firstName = req.body.fname, 
    lastName = req.body.lname, 
    email = req.body.email, 
    company = req.body.company,
    country = req.body.country,
    phone = phoneUtil.parse(req.body.phone, customList('countryNameEn', '{countryCode}')[country]),
    role = req.body.role,
    state = req.body.state,
    city = req.body.city,
    address1 = req.body.address1,
    address2 = req.body.address2;
    check(email, (err, response) => {
        if (err || !response) {
            error = "The email you entered doesn't exist";
            res.redirect("/subscribe#newsletter");
        } else {
            if (phoneUtil.isValidNumber(phone)) {
                const run = async () => {
                    const response = await client.lists.batchListMembers("71c3a51cce", {
                        members: [{
                            email_address: email,
                            status: "subscribed",
                            merge_fields: {
                                FNAME: firstName,
                                LNAME: lastName,
                                COMPANY: company,
                                PHONE: phoneUtil.format(phone, PNF.INTERNATIONAL),
                                ROLE: role,
                                COUNTRY: country,
                                STATE: state,
                                CITY: city,
                                ADDRESS1: address1,
                                ADDRESS2: address2
                            }
                        }]
                    });
                    if (response.error_count === 0) {
                        res.redirect("/subscribe/success");
                    } else {
                        if (result.errors[0].error_code === 'ERROR_CONTACT_EXISTS') {
                            new_client.update_existing = true;
                            run();
                        } else {
                            console.error(response.errors[0].error);
                            res.redirect("/subscribe/error");
                        }
                    }
                }
                run();
            } else {
                error = "The phone number you entered is invalid to the country";
                res.redirect("/subscribe#newsletter");
            }
        }
    });
});

router.get("/success")

module.exports = router;