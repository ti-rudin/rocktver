module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8752263ec2a3dbaf985f85c35a346d12'),
  },
});
