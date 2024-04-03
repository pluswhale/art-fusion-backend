 const allowedOrigins = [
    'http://localhost:3000',
    'https://nft-marketplace-three-mu.vercel.app',
    'https://nft-marketplace-bje3e6i89-pluswhale.vercel.app'
];

 const hostBackendUrl = 'https://nft-marketplace-three-mu.vercel.app'
 const localBackendUrl = 'http://localhost:3000'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
 
module.exports =  {allowedOrigins, hostBackendUrl, localBackendUrl, JWT_SECRET}