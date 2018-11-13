import _MineLoaderJ, { CommandDescriptions } from 'js-bootstrap/MineLoaderJ'
import Logger from 'js-bootstrap/MineLoaderJ/Logger'
import CommandSender from 'js-bootstrap/MineLoaderJ/bukkit/command/CommandSender'
import * as _Java from 'js-bootstrap/Java'
type JavaObject = _Java.JavaObject
import { getData } from './Colors'


const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'

declare global {
  const MineLoaderJ: typeof _MineLoaderJ
}
export const name = 'Image Builder'
let logger: Logger
const ChatColor = MineLoaderJ.ChatColor
const Player = MineLoaderJ.bukkit.entity.Player
const setBlock = MineLoaderJ.helpers.setBlock
let Jimp
export function init(inst: _MineLoaderJ, _logger: Logger) {
  logger = _logger
  try {
    Jimp = require('jimp')
  } catch(err) {
    logger.severe('Npm package `jimp` cannot be loaded, please install it first:', err.message, err.stack)
  }
  // Patch Buffer
  /* let _Buffer = Buffer as any
  _Buffer._from = _Buffer.from;
  _Buffer.from = function() {
    try {
      return _Buffer._from.apply(_Buffer, arguments)
    } catch(err) {
      return Buffer.prototype.constructor.apply(null, arguments)
    }
  } */
}
function extractArgument(sender: CommandSender, args: string[]) {
  // if(!Jimp) {
  //   sender.sendMessage(ChatColor.RED + 'Npm package `jimp` not found, please install it first')
  //   return true
  // }

  if(args.length < 4) return null

  let pos: [number, number, number]
  try {
    pos = args.slice(1, 4).map(v => parseInt(v)) as typeof pos
  } catch {
    return null
  }
  for(let c of pos) {
    if(isNaN(c)) return null
  }
  
  let scale: number
  try {
    scale = parseFloat(args[4])
    if(scale < 0) scale = 1
  } catch {}
  scale = scale || 1

  let data: string | Buffer = args[0]
  if(!args[0].match(/^https?:\/\//)) {
    try {
      data = new Buffer(data, 'base64')
    } catch {
      sender.sendMessage(ChatColor.RED + 'Invalid image data (base64 encoding)')
      return null
    }
  }

  let world: JavaObject = null
  if(sender instanceof Player) world = sender.getWorld()
  return {
    data,
    world,
    pos,
    scale
  }
}
export let commands: CommandDescriptions = {
  img: {
    description: 'Build image with block',
    usage: '/js img <url | base64 code> <x> <y> <z> [scale]',
    aliases: [],
    onCommand: (sender: CommandSender, commandName: string, args: string[]): boolean => {
      if(!Jimp) {
        sender.sendMessage(ChatColor.RED + 'Npm package `jimp` not found, please install it first')
        return true
      }

      let res = extractArgument(sender, args)
      if(!res) return false
      let { data, world, pos, scale } = res

      Jimp.read(data)
      .then(image => {
        if(scale != 1) image = image.scale(scale)
        
        let width: number = image.getWidth()
        let height: number = image.getHeight()
        function render(row: number, col: number) {
          let _row = row + 10
          let _col = col + 10
          logger.info(`Rendering blocks from (${row}, ${col}) to (${_row}, ${_col})`)
          for(let y = row; y < _row && y < height; y++) {
            for(let x = col; x < _col && x < width; x++) {
              let color: {
                r: number,
                g: number,
                b: number,
                a: number
              } = Jimp.intToRGBA(image.getPixelColor(x, y))
              if(color.a > 128) setBlock(world, pos[0] + x, pos[1], pos[2] + y, 'WOOL', getData(color))
            }
          }
          if(_col >= width) {
            row += 10
            col = 0
          } else {
            col = _col
          }
          if(_row < height || _col < width) setImmediate(render, row, col)  // process.nextTick(render, row, col)
          else logger.info('Image placed')
        }
        setImmediate(render, 0, 0)  // process.nextTick(render, 0, 0)
      })
      .catch(err => {
        logger.warn('Cannot load image:', err.stack)
      })
      return true
    }
  },
  imgv: {
    description: 'Build image with block (vertical)',
    usage: '/js imgv <url | base64 code> <x> <y> <z> [scale]',
    aliases: [],
    onCommand: (sender: CommandSender, commandName: string, args: string[]): boolean => {
      if(!Jimp) {
        sender.sendMessage(ChatColor.RED + 'Npm package `jimp` not found, please install it first')
        return true
      }

      let res = extractArgument(sender, args)
      if(!res) return false
      let { data, world, pos, scale } = res

      Jimp.read(data)
      .then(image => {
        if(scale != 1) image = image.scale(scale)
        
        let width: number = image.getWidth()
        let height: number = image.getHeight()
        function render(row: number, col: number) {
          let _row = row + 10
          let _col = col + 10
          logger.info(`Rendering blocks from (${row}, ${col}) to (${_row}, ${_col})`)
          for(let y = row; y < _row && y < height; y++) {
            for(let x = col; x < _col && x < width; x++) {
              let color: {
                r: number,
                g: number,
                b: number,
                a: number
              } = Jimp.intToRGBA(image.getPixelColor(x, y))
              if(color.a > 128) setBlock(world, pos[0] + x, pos[1] - y, pos[2], 'WOOL', getData(color))
            }
          }
          if(_col >= width) {
            row += 10
            col = 0
          } else {
            col = _col
          }
          if(_row < height || _col < width) setImmediate(render, row, col)  // process.nextTick(render, row, col)
          else logger.info('Image placed')
        }
        setImmediate(render, 0, 0)  // process.nextTick(render, 0, 0)
      })
      .catch(err => {
        logger.warn('Cannot load image:', err.stack)
      })
      return true
    }
  }
}