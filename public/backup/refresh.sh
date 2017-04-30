#!/bin/bash

BASEDIR=$(dirname "$0")
ARCHIVE=cwbattlefields.archive
ARCHFILE=$BASEDIR/$ARCHIVE

# Remove old archive
echo `rm -f $ARCHFILE`