import Vue from 'vue'

export const makeAppendChildToParrentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state.items[parentId]

    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }
