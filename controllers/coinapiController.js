const axios = require('axios');
const { preferences } = require('joi');

// Want to use async/await? Add the `async` keyword to your outer function/method.
const getPrice = async (req, res) => {
	try {
		const { user } = res.locals;
		console.log(user);
		let data = {};
		const response = await axios
			.get('https://api.coingecko.com/api/v3/simple/price', {
				params: {
					ids: 'bitcoin,ethereum,litecoin,ripple',
					vs_currencies: 'inr',
				},
			})
			.then(function (response) {
				data = response.data;
				// console.log(response.data);
			})
			.catch(function (error) {
				throw new Error(error);
			});
		res.render('../views/index', {
			user,
			bitcoin: data.bitcoin.inr,
			litecoin: data.litecoin.inr,
			ethereum: data.ethereum.inr,
			ripple: data.ripple.inr,
		});
	} catch (error) {
		console.error(error);
	}
};

const getMarketPrice = async (req, res) => {
	try {
		let bitcoin_percentage = await calculatePercentageChange(
			'bitcoin',
			'14-02-2022',
			'15-02-2022'
		);
		let litecoin_percentage = await calculatePercentageChange(
			'litecoin',
			'14-02-2022',
			'15-02-2022'
		);
		let ripple_percentage = await calculatePercentageChange(
			'ripple',
			'14-02-2022',
			'15-02-2022'
		);
		let ethereum_percentage = await calculatePercentageChange(
			'ethereum',
			'14-02-2022',
			'15-02-2022'
		);

		const { user } = res.locals;
		// console.log(req.sessionID);
		let data = {};
		const response = await axios
			.get('https://api.coingecko.com/api/v3/simple/price', {
				params: {
					ids: 'bitcoin,ethereum,litecoin,ripple',
					vs_currencies: 'inr',
				},
			})
			.then(function (response) {
				data = response.data;
				// console.log(response.data);
			})
			.catch(function (error) {
				throw new Error(error);
			})
			.then(function () {
				res.render('../views/market-capital', {
					user,
					bitcoin: data.bitcoin.inr,
					litecoin: data.litecoin.inr,
					ethereum: data.ethereum.inr,
					ripple: data.ripple.inr,
					bitcoinpercentage: bitcoin_percentage,
					ethereumpercentage: ethereum_percentage,
					ripplepercentage: ripple_percentage,
					litecoinpercentage: litecoin_percentage,
				});
			});
	} catch (error) {
		console.error(error);
	}
};

const getPriceCall = async (coin, date) => {
	const response = await axios
		.get(`https://api.coingecko.com/api/v3/coins/${coin}/history`, {
			params: {
				date: date,
			},
		})
		.then(function (response) {
			// console.log(response.data.market_data.current_price.inr)
			return Number(response.data.market_data.current_price.inr);
		})
		.catch(function (error) {
			throw new Error(error);
		});
	return response;
};

const calculatePercentageChange = async (coin, date_prv, date_current) => {
	let prv_price = await getPriceCall(coin, date_prv);
	let curr_price = await getPriceCall(coin, date_current);
	let percentage = ((curr_price - prv_price) / curr_price) * 100;
	percentage = percentage.toFixed(2);

	return percentage;
};

module.exports = { getPrice, getMarketPrice };
