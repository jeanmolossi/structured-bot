import mongoose from 'mongoose';

mongoose.connect(
  'mongodb://localhost:27017/teste?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

mongoose.connection.on('open', () => console.log('Connected with DB!'));
