#!/bin/bash

# Clears any archive files from current folder

BASEDIR=$(dirname "$0")
ARCHIVE=cwbattlefields.archive
ARCHFILE=$BASEDIR/$ARCHIVE

# Remove old archive
echo `rm -f $ARCHFILE`