import express from 'express';
const router = express.Router();

router.use((req,res,next) => {
		var today = new Date();
		var todayFull = Number(today.getFullYear())+'-'+Number(today.getMonth()+1)+'-'+Number(today.getDate())+'-'+Number(today.getHours())+':'+Number(today.getMinutes());
		console.log('Time: ',todayFull);
		next();
	});
router.get('/',(req,res) => {
	res.send('articlesasdfasdf');
});

router.get('/read/:id',(req,res) => {
	res.send('You are reading article'+req.params.id);
});



export default router
