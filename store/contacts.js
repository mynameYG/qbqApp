import Vue from 'vue'

const contactsStore = {
	namespaced: true,
	state() {
		return {
			datas: new Map(),
			count:0,
		}
	},
	mutations: {
		addUser(state, {user, multi = true}) {
			if(!multi){
				state.datas.clear();
			}
			state.datas.set(user.id, user);
			state.count += 1;
		},
		removeUser(state, user) {
			state.datas.delete(user.id);
			state.count -= 1;
		},
		// 使用下面的,上面的要删除
		init(state, datas) {
			state.datas.clear();
			state.count = 0;
			if(typeof datas !== "undefined" && datas.length > 0) {
				for (let data of datas) {
					state.datas.set(data.id, data);
					state.count += 1;
				}
				state.count = state.datas.size;
			}
		},
		put(state, {data, multi = true}) {
			if(!multi){
				state.datas.clear();
				state.count = 0;
			}
			state.datas.set(data.id, data);
			state.count = state.datas.size;
		},
		putAll(state, datas) {
			for (let data of datas) {
				state.datas.set(data.id, data);
			}
			state.count = state.datas.size;
		},
		remove(state, data) {
			state.datas.delete(data.id);
			state.count = state.datas.size;
		},
	},
	getters: {
		list(state) {
			let count = state.count;
			return Array.from(state.datas.values());
		},
		count(state) {
			return state.count;
		},
		ids(state) {
			let count = state.count;
			return Array.from(state.datas.keys()).join(",");
		},
		names(state) {
			let count = state.count;
			let names = [];
			for (let data of state.datas.values()) {
				names.push(data.name);
			}
			return names.join(",");
		}
	}
}

export default contactsStore