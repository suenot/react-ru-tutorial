var my_news = [
	{
		author: 'Саша Печкин',
		text: 'В четчерг, четвертого числа...',
		bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
	},
	{
		author: 'Просто Вася',
		text: 'Считаю, что $ должен стоить 35 рублей!',
		bigText: 'А евро 42!'
	},
	{
		author: 'Гость',
		text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
		bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
	}
];

var Article = React.createClass({
	propTypes: {
		data: React.PropTypes.shape({
			author: React.PropTypes.string.isRequired,
			text: React.PropTypes.string.isRequired,
			bigText: React.PropTypes.string.isRequired
		})
	},
	getInitialState: function() {
		return {
			visible: false
		};
	},
	readmoreClick: function(e) {
		e.preventDefault();
		this.setState({visible: true});
	},
	render: function() {
		var author = this.props.data.author;
		var text = this.props.data.text;
		var bigText = this.props.data.bigText;
		var visible = this.state.visible;
		console.log('render',this); //добавили console.log
		return (
			<div className="article">
				<p className="news__author">{author}:</p>
				<p className="news__text">{text}</p>
				<a href="#" onClick={this.readmoreClick} className={'news__readmore ' + (visible ? 'none': '')}>Подробнее</a>
				<p className={'news__big-text ' + (visible ? '': 'none')}>{bigText}</p>
			</div>
		)
	}
});

var News = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return {
			counter: 0
		}
	},
	onTotalNewsClick: function() {
		this.setState({counter: ++this.state.counter });
	},
	render: function() {
		var data = this.props.data;
		var newsTemplate;

		if (data.length > 0) {
			newsTemplate = data.map(function(item, index) {
				return (
					<div key={index}>
						<Article data={item} />
					</div>
				)
			})
		} else {
			newsTemplate = <p>К сожалению новостей нет</p>
		}

		return (
			<div className='news'>
				{newsTemplate}
				<strong
					className={'news__count ' + (data.length > 0 ? '':'none') }
					onClick={this.onTotalNewsClick}>
					Всего новостей: {data.length}
				</strong>
			</div>
		);
	}
});

var Comments = React.createClass({
	render: function() {
		return (
			<div className="comments">
				Нет новостей - комментировать нечего
			</div>
		);
	}
});

var TestInput = React.createClass({
	componentDidMount: function() {
		ReactDOM.findDOMNode(this.refs.myTestInput).focus();
	},
	onBtnClickHandler: function(e) {
		console.log(this.refs);
		alert(ReactDOM.findDOMNode(this.refs.myTestInput).value);
	},
	render: function() {
		return (
			<div>
				<input className='test-input' ref='myTestInput' defaultValue='' placeholder='введите значение' />
				<button onClick={this.onBtnClickHandler} ref='alert_button'>Показать alert</button>
			</div>
		);
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div className="app">
				<h3>Новости</h3>
				<TestInput />
				<News data={my_news} />
			</div>
		);
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('root')
);