# library-management-system
Use Express-mongodb to create some REST API endpoints to perform these actions: (library management system)

## Tech Stack
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## API :man_technologist:

- [Cloudinary API](https://cloudinary.com/)

## Installation :zap:

**1. Clone this repo by running the following command :-**

```bash
 git clone git+https://github.com/wakidur/library-management-system.git
 cd library-management-system
```


**2. Create a .env file in**

```
PORT=5000
NODE_ENV=development

MONGO_URI =your mongodb uri


FILE_UPLOAD_PATH=./public/uploads/product
FILE_UPLOAD_SIZE=1000000

JWT_SECRET=b7cbd300
JWT_EXPIREIN=10d
JWT_COOKIE_EXPIRE=10d

#https://cloudinary.com/
CLOUD_NAME=your cloudinary name
API_KEY=your cloudinary api key
API_SECRET=your cloudinary api secret key

```