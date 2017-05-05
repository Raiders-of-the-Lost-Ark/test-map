#!/bin/bash

# Restores MongoDB database from archive in current folder

BASEDIR=$(dirname "$0")
DBNAME=testsites
COLLECTION=sites
ARCHIVE=cwbattlefields.archive
LOG=log

LOGFILE=$BASEDIR/$LOG
ARCHFILE=$BASEDIR/$ARCHIVE

DATE=$(date +"%Y%m%d%H%M")
DUMPNAME=mongodump-$DBNAME-$DATE

echo `date '+%Y-%m-%d %H:%M:%S'` Restoring database >> $LOG

# Create archived dump
mongorestore --gzip --archive=$ARCHFILE --db $DBNAME >> $LOG