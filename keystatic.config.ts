import { config, collection, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'local',
  },

  ui: {
    brand: { name: '顾得 · 内容管理' },
  },

  collections: {
    posts: collection({
      label: '文章',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: '标题', validation: { isRequired: true } },
        }),
        date: fields.date({
          label: '发布日期',
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: '摘要（显示在文章列表）',
          multiline: true,
        }),
        tags: fields.array(
          fields.text({ label: '标签' }),
          { label: '标签', itemLabel: (props) => props.value }
        ),
        coverImage: fields.image({
          label: '封面图片',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),
        content: fields.mdx({
          label: '正文',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts',
            },
          },
        }),
      },
    }),
  },
})
