#!/bin/sh
rm main.db
sqlite3 main.db < init.sql
