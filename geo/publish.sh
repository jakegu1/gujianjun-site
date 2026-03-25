#!/bin/bash
# GEO 文章发布脚本
# 用法: bash geo/publish.sh <slug> <article-id>
# 例如: bash geo/publish.sh what-is-geo P1-01

SLUG=$1
ARTICLE_ID=$2
FILE="content/posts/${SLUG}.mdx"

if [ -z "$SLUG" ] || [ -z "$ARTICLE_ID" ]; then
  echo "用法: bash geo/publish.sh <slug> <article-id>"
  echo "例如: bash geo/publish.sh what-is-geo P1-01"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "错误: 文件 $FILE 不存在"
  exit 1
fi

echo "准备发布: $FILE"
echo "---"
head -10 "$FILE"
echo "---"
echo ""
read -p "确认发布？(y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  git add "$FILE"
  git commit -m "feat: add ${ARTICLE_ID} - $(head -2 "$FILE" | grep title | sed 's/title: "//;s/"//')"
  git push
  echo ""
  echo "已发布！约2分钟后可访问: https://gujianjun.net/blog/${SLUG}"
else
  echo "已取消"
fi
