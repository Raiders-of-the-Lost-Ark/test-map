#!/bin/bash

# createbackup.sh
# Creates backup of database and stores it in current folder

BASEDIR=$(dirname "$0")
DBNAME=testsites
COLLECTION=sites
ARCHIVE=cwbattlefields.archive
LOG=log

LOGFILE=$BASEDIR/$LOG
ARCHFILE=$BASEDIR/$ARCHIVE

DATE=$(date +"%Y%m%d%H%M")
DUMPNAME=mongodump-$DBNAME-$DATE

# Remove old archive
echo `rm -f $ARCHFILE`

echo `date '+%Y-%m-%d %H:%M:%S'` Dumping database >> $LOG

# Create archived dump
mongodump --gzip --db $DBNAME --collection $COLLECTION --archive=$ARCHFILE >> $LOG