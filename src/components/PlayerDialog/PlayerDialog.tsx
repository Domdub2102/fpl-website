'use client'

import React from 'react'
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Player } from '@/types/types'

type Props = {
  player: Player
  openDialog: React.ReactNode
}

export function PlayerDialog({ player, openDialog }: Props) {
    return (
        <Dialog>
          <DialogTrigger asChild>
              <button>{openDialog}</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[300px]">
            <DialogHeader>
              <DialogTitle className='text-center mb-5'>{player.first_name + " " + player.second_name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="">
                <Button className='cursor-pointer'>Substitute</Button>
              </div>
              <div className="">
                <Button className='cursor-pointer'>Transfer Out</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
}