-- debug.lua
-- Copyright (C) 2020 by RStudio, PBC
-- improved formatting for dumping tables
function tdump (tbl, indent, refs)
  if not refs then refs = {} end
  if not indent then indent = 0 end
  local address = string.format("%p", tbl)
  if refs[address] ~= nil then
    print(string.rep("  ", indent) .. "(circular reference to " .. address .. ")")
    return
  end

  if tbl.t then
    print(string.rep("  ", indent) .. tbl.t)
  end
  local empty = true
  for k, v in pairs(tbl) do
    empty = false
    formatting = string.rep("  ", indent) .. k .. ": "
    if type(v) == "table" then
      print(formatting .. "table: " .. address)
      refs[address] = true
      tdump(v, indent+1, refs)
    elseif type(v) == 'boolean' then
      print(formatting .. tostring(v))
    elseif (v ~= nil) then 
      print(formatting .. tostring(v))
    else 
      print(formatting .. 'nil')
    end
  end
  if empty then
    print(string.rep("  ", indent) .. "<empty table>")
  end
end

-- dump an object to stdout
local function dump(o)
  if type(o) == 'table' then
    tdump(o)
  else
    print(tostring(o) .. "\n")
  end
end

-- is the table a simple array?
-- see: https://web.archive.org/web/20140227143701/http://ericjmritz.name/2014/02/26/lua-is_array/
function tisarray(t)
  local i = 0
  for _ in pairs(t) do
    i = i + 1
    if t[i] == nil then
      return false
    end
  end
  return true
end

-- does the table contain a value
local function tcontains(t, value)
  if t and type(t) == "table" and value then
    for _, v in ipairs(t) do
      if v == value then
        return true
      end
    end
    return false
  end
  return false
end

function pandoc_globals()
  -- from https://pandoc.org/lua-filters.html#global-variables
  -- every other global besides FORMAT doesn't seem
  -- to serialize correctly, so instead we pluck only the
  -- fields we need

  local globals = {
    FORMAT = FORMAT,
    PANDOC_WRITER_OPTIONS = {
      extensions = PANDOC_WRITER_OPTIONS.extensions
    }
  }
  quarto.utils.dump(globals)
  local result = quarto.json.encode(globals)

  tmp = io.open("/tmp/lua-globals.json", "wb")
  tmp:write(result)
  tmp:close()
end

function typescriptFilter(path)
  return {
    Pandoc = function(doc)
      local filter = quarto.utils.resolvePath(path)
      local denoPath = param("deno-path")

      pandoc_globals()
      local result = pandoc.utils.run_json_filter(doc, denoPath, {
        "run", "--cached-only", "--unstable", "--allow-all", "--no-config", os.getenv("QUARTO_IMPORT_MAP"), filter 
      })
      return result
    end
  }
end

return {
  dump = dump,
  table = {
    isarray = tisarray,
    contains = tcontains
  },
  typescriptFilter = typescriptFilter
}

