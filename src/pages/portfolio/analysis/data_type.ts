
// 基金组合业绩表现
interface performanceType {
  acc_return_yield: {p: number, b: number},
  annualized_return_yield: {p: number, b: number},
  daily_change: {
    p: {mean: number, max: number, min: number, win_ratio: number},
    b: {mean: number, max: number, min: number, win_ratio: number}
  },
  trading_day_count: {
    p: {win: number, lose: number, draw: number},
    b: {win: number, lose: number, draw: number}
  },
  annualized_volatility: {
    p: {vol: number, downside_vol: number},
    b: {vol: number, downside_vol: number}
  },
  max_drawback: {
    p: {start: string, end: string, drawback: number},
    b: {start: string, end: string, drawback: number}
  },
  ucr: {
    p: number,
    b?: number
  },
  dcr: {
    p: number,
    b?: number
  },
  sharpe_ratio: {
    p: number,
    b: number
  },
  calmar_ratio: {
    p: number,
    b: number
  },
  sortino_ratio: {
    p: number,
    b: number
  },
  var: {
    p: number,
    b: number
  },
  cvar: {
    p: number,
    b: number
  }
}


// 基金组合收益贡献
interface contributeType {
  total_profit: number,
  equity: number,
  bond: number,
  alter: number,
  money: number,
}

// 组合持仓基金数据
interface holdingFundType {
  key: number,
  secucode: string,
  secuname?: string,
  branch: string,
  classify: string,
  mkt_cap: number,
  ratio: number,
  profit: number,
  war: number,
  day: number,
  week: number,
  month: number,
  quarter: number,
  half_year: number,
  year: number,
  ytd: number,
  apply_type: string,
  redeem_type: string,
  min_apply: number,
  max_apply: number,
}

interface holdingCtaType {
  key: number,
  secucode: string,
  secuabbr: string,
  recent: string,
  date: string,
  mkt_cap: number,
  ratio: number,
  week: number,
  month: number,
  quarter: number,
  last_year: number,
  year: number,
  ytd: number,
}

// 组合持仓基金数据-宜信普泽
interface holdingFundTypeYX {
  key: number,
  secucode: string,
  secuname: string,
  mkt_cap: number,
  holding_value: number,
  shares: number,
  ratio: number,
}

// 组合持仓-野村东方分类
interface holdingNOI {
  key: number
  secucode: string
  secuname: string
  mkt_cap: number
  ratio: number
}


// 基金持股
interface holdingStockType {
  key: number,
  secucode: string,
  secuname: string,
  ratio: number,
  ofnv: number,
  cumsum: number
}

// 行业占比
interface industryType {
  key: number,
  firstindustryname: string,
  ratio: number,
  ratioinequity: number,
  weight: number,
  scaled_ratio: number,
  diff: number
}


// 组合风格
interface styleType {
  id: number,
  port_code: string,
  small_value: number,
  small_growth: number,
  mid_value: number,
  mid_growth: number,
  large_value: number,
  large_growth: number,
  bond: number,
  r_square: number,
  date: string
}

// 组合季度账户变化
interface accountChangeType {
  date: string,
  s: number,
  c: number
}


// 组合营收概况
interface profitType {
  profit: {
    up: number,
    down: number
  },
  count: {
    up: number,
    down: number
  }
}

// CTA流水
interface TransCtaType {
  secucode: string
  amount: number
  share: number
  price: number
}


// ETF数据
interface holdingETF {
  secucode: string
  secuabbr: string
  date: Date
  profit: number
  fare: number
  mkt_cap: number
  current_shares: number
  children?: holdingETF[]
}

interface transETF {
  buy_date: string
  sell_date: string
  buy_price: number
  sell_price: number
  value: number
  r: number
  profit: number
  fee: number
  note: string
}
