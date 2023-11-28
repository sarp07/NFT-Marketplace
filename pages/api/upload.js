// // pages/api/upload.js
// import multer from 'multer';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: '/upload/images',
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
//     },
//   }),
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     upload.single('image')(req, res, (err) => {
//       try {
//         if (err) {
//           throw new Error(err.message);
//         }

//         if (!req.file) {
//           // Eğer dosya yüklenmemişse hata döndür
//           throw new Error('No file uploaded.');
//         }

//         const imageURL = `/upload/images/${req.file.filename}`;
//         return res.status(200).json({ url: imageURL });
//       } catch (error) {
//         return res.status(500).json({ error: error.message });
//       }
//     });
//   } else {
//     res.status(405).end(); // Method Not Allowed
//   }
// }

// pages/api/upload.js
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/upload/images',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('image')(req, res, (err) => {
      try {
        if (err) {
          throw new Error(err.message);
        }

        if (!req.file) {
          // Eğer dosya yüklenmemişse hata döndür
          throw new Error('No file uploaded.');
        }

        const imageURL = `/upload/images/${req.file.filename}`;
        return res.status(200).json({ url: imageURL });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
