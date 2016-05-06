window.ee = new EventEmitter();
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

var Add = React.createClass({
	getInitialState: function() {
		return {
			agreeNotChecked: true,
			authorIsEmpty: true,
			textIsEmpty: true
		};
	},
	componentDidMount: function() {
		ReactDOM.findDOMNode(this.refs.author).focus();
	},
	onBtnClickHandler: function(e) {
		e.preventDefault();
		var textEl = ReactDOM.findDOMNode(this.refs.text);
		var author = ReactDOM.findDOMNode(this.refs.author).value;
		var text = ReactDOM.findDOMNode(this.refs.text).value;
		var item = [{
			author: author,
			text: text,
			bigText: '...'
		}];
		window.ee.emit('News.add', item);
		textEl.value = '';
		this.setState({textIsEmpty: true});
	},
	onCheckRuleClick: function(e) {
		this.setState({agreeNotChecked: !this.state.agreeNotChecked});
	},
	onFieldChange: function(fieldName, e) {
		if (e.target.value.trim().length > 0) {
			this.setState({[''+fieldName]:false})
		} else {
			this.setState({[''+fieldName]:true})
		}
	},
	render: function() {
		var agreeNotChecked = this.state.agreeNotChecked;
		var authorIsEmpty = this.state.authorIsEmpty;
		var textIsEmpty = this.state.textIsEmpty;
		return (
			<form className='add cf'>
				<input
					type='text'
					className='add__author'
					defaultValue=''
					placeholder='Ваше имя'
					ref='author'
					onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
				/>
				<textarea
					className='add__text'
					defaultValue=''
					placeholder='Текст новости'
					ref='text'
					onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
				></textarea>
				<label className='add__checkrule'>
					<input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick} />Я согласен с правилами
				</label>
				<button
					className='add__btn'
					onClick={this.onBtnClickHandler}
					ref='alert_button'
					disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
					Добавить новость
				</button>
			</form>
		);
	}
});

var App = React.createClass({
	getInitialState: function() {
		return {
			news: my_news
		};
	},
	componentDidMount: function() {
		var self = this;
		window.ee.addListener('News.add', function(item) {
			var nextNews = item.concat(self.state.news);
			self.setState({news: nextNews});
		});
	},
	componentWillUnmount: function() {
		window.ee.removeListener('News.add');
	},
	render: function() {
		console.log('render');
		return (
			<div className='app'>
				<Add />
				<h3>Новости</h3>
				<News data={this.state.news} />
			</div>
		);
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('root')
);