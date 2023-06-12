function Pandoc(doc)
  local c = quarto.Callout({
    type = "note",
    content = { pandoc.Div(pandoc.Plain("This is a note")) },
    title = "Note title"
  })
  print(c)
  doc.blocks:insert(pandoc.Plain(c))
  return doc
end