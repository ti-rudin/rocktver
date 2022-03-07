module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'strapi-provider-email-smtp',
            providerOptions: {
                host: 'smtp.yandex.ru', //SMTP Host
                port: 465, //SMTP Port
                secure: true,
                username: 'robot@rocktver.ru',
                password: 'avkpqecbzlrnykcr',
                rejectUnauthorized: true,
                requireTLS: true,
                connectionTimeout: 1,
            },
        },
        settings: {
            from: 'robot@rocktver.ru',
            replyTo: 'noreplay@rocktver.ru',
        },
    },
});

//module.exports = ({ env }) => ({
//    // ...
//    email: {
//        config: {
//            provider: 'sendmail',
//            providerOptions: {
//                smtpHost: 'smtp.yandex.ru', //SMTP Host
//                smtpPort: 465, //SMTP Port
//                secure: true,
//                username: 'robot@rocktver.ru',
//                password: 'avkpqecbzlrnykcr',
//                rejectUnauthorized: true,
//                requireTLS: true,
//                connectionTimeout: 1,
//            },
//            settings: {
//                defaultFrom: 'robot@rocktver.ru',
//                defaultReplyTo: 'robot@rocktver.ru',
//            },
//        },
//    },
//    // ...
//});

