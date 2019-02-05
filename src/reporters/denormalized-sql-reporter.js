import { exec } from '../data-providers/sql-provider';

const SCHEMA_NAME = "SegueReporting";
const EVENT_TABLE_NAME = `${SCHEMA_NAME}.DnEvents`;
const RACK_TABLE_NAME = `${SCHEMA_NAME}.Racks`;
const SLIDE_TABLE_NAME = `${SCHEMA_NAME}.Slides`;

async function log(sql) {
  try {
    const result = await exec(sql);
  } catch (ex) {
    console.error(`Error executing query "${sql}", ${ex.message}`);
  }
}

const handlers = {
  RackLoaded({ scanner, id, type, position, loadedTime, unloadedTime }) {
    log(
      addRackSql({
        scannerId: scanner.id,
        id,
        position,
        ...type,
        loadedTime,
        unloadedTime
      })
    );

    return {
      scannerId: scanner.id,
      rackId: id,
      value: d(loadedTime)
    };
  },
  RackUnloaded({ scanner, id, type, position, loadedTime, unloadedTime }) {
    log(
      updateRackSql({
        scannerId: scanner.id,
        id,
        position,
        ...type,
        loadedTime,
        unloadedTime
      })
    );

    return {
      scannerId: scanner.id,
      rackId: id,
      value: d(unloadedTime)
    };
  },
  SlideLoaded({ rack, id, position, startTime }) {
    log(
      addSlideSql({
        rackId: rack.id,
        id,
        position
      })
    );

    return {
      scannerId: rack.scanner.id,
      rackId: rack.id,
      slideId: id,
      value: d(startTime)
    };
  },

  SlideUnloaded(
    { rack, id, height, width, area, scanTime, startTime, endTime },
    timestamp
  ) {
    const baseObj = {
      scannerId: rack.scanner.id,
      rackId: rack.id,
      slideId: id,
      timestamp
    };
    log(
      eventSql([
        {
          ...baseObj,
          name: "SlideHeight",
          value: height
        },
        {
          ...baseObj,
          name: "SlideWidth",
          value: width
        },
        {
          ...baseObj,
          name: "SlideArea",
          value: area
        },
        {
          ...baseObj,
          name: "SlideScanTime",
          value: scanTime
        }
      ])
    );
    return baseObj;
  }
};

export const denormalizedSqlReporter = {
  capture({ event, data, timestamp }) {
    let val;
    if (handlers[event]) {
      val = eventSql({
        ...handlers[event](data, timestamp),
        name: event,
        timestamp
      });
    }
    if (val) {
      log(val);
    }
  },
  report() {
  }
};

function addRackSql({ scannerId, id, position, type, capacity }) {
  return `INSERT INTO ${RACK_TABLE_NAME} (ScannerGuid, RackGuid, Position) VALUES (${g(
    scannerId
  )}, ${g(id)}, ${n(position)})`;
}

function updateRackSql({ scannerId, id, position, type, capacity }) {
  const udpateClause = [];
  if (position) {
    udpateClause.push(`Position = ${n(position)}`);
  }
  if (type) {
    udpateClause.push(`RackType = ${n(type)}`);
  }
  if (capacity) {
    udpateClause.push(`Capacity = ${n(capacity)}`);
  }
  return `UPDATE ${RACK_TABLE_NAME} SET ${udpateClause.join(
    ", "
  )} WHERE ScannerGuid = ${g(scannerId)} AND RackGuid = ${g(id)}`;
}

function addSlideSql({ rackId, id, position }) {
  return `INSERT INTO ${SLIDE_TABLE_NAME} (RackGuid, SlideGuid, Position) VALUES (${g(
    rackId
  )}, ${g(id)}, ${n(position)})`;
}

function eventSql(val) {
  if (!Array.isArray(val)) {
    val = [val];
  }
  const items = val
    .map(
      v =>
        `(${g(v.scannerId)}, ${g(v.rackId)}, ${g(v.slideId)}, ${s(v.name)}, ${s(
          v.value
        )}, ${s(d(v.timestamp))})`
    )
    .join(", ");
  return `INSERT INTO ${EVENT_TABLE_NAME} (ScannerGuid, RackGuid, SlideGuid, Name, Value, Timestamp) VALUES ${items}`;
}

function s(val) {
  return val ? `'${val}'` : "NULL";
}

function n(val) {
  return val || "NULL";
}

const g = s;

function d(val) {
  return val ? val.toISOString() : "NULL";
}
