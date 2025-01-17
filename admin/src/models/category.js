import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils';
import { downloadBuffer } from '@/utils/utils';
import config from '@/config';

const API_URL = config.API_ROOT + '/category';

export default {
	namespace: 'category',

	state: {
		selectedNode: null,
		selectedRows: [],
		selectedRowKeys: [],
		queryParams: {},
		data: [],
		showQueryCondition: false,
		columns: [],
		fields: []
	},

	effects: {
		*fetch({ payload }, { call, put, select }) {
			payload.page = !!payload.page ? payload.page - 1 : 0;
			payload.pageSize = config.PAGE_SIZE;

			const { queryParams } = yield select((state) => state.category);

			const params = _.merge(queryParams, payload);

			yield put({
				type: 'set'
			});

			const res = yield call(apiGet, API_URL + '/list', { params });

			if (!!res) {
				yield put({
					type: 'set',
					payload: {
						selectedRows: [],
						selectedRowKeys: [],
						queryParams: params,
						data: res
					}
				});
			}
		},
		*detail({ payload }, { call, put }) {
			const res = yield call(apiGet, API_URL + '/' + payload.id);

			yield put({
				type: 'set',
				payload: {
					selectedNode: res
				}
			});

			payload.callback && payload.callback(res);
		},
		*save({ payload }, { call, put, select }) {
			const { selectedNode } = yield select((state) => state.category);

			let res = null;

			if (_.isEmpty(selectedNode)) {
				res = yield call(apiPost, API_URL, payload);
			} else {
				res = yield call(apiPut, API_URL, _.merge(selectedNode, payload));
			}

			if (!!res) {
				yield put({
					type: 'fetch',
					payload: {

					}
				});
				message.success('保存成功');
			}
		},
		*remove({ payload }, { call, select }) {
			const selectedRows = yield select((state) => state.category.selectedRows);

			yield call(apiDelete, API_URL, {
				params: {
					selectedRows: selectedRows.map((item) => item.id).join(',')
				}
			});

			payload.callback && payload.callback();
		},
	},

	reducers: {
		set(state, { payload }) {
			return {
				...state,
				...payload
			};
		}
	}
};
