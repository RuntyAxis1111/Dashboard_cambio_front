/*
  # Create DSP Latest Metrics View

  1. New Views
    - `dsp_latest_metrics`
      - Shows the most recent metric date for each entity/platform combination
      - Used to display "Last Updated" badge on DSP reports
  
  2. Purpose
    - Provides quick access to the latest update timestamp for each artist/DSP
    - Powers the "Last Updated" badge in the DSP Live Growth reports
    - Uses 'dsp' as alias for 'platform' to match frontend expectations
    - Uses 'metric_date' as alias for 'ts' to match frontend expectations
*/

CREATE OR REPLACE VIEW dsp_latest_metrics AS
SELECT 
  entidad_id,
  platform as dsp,
  MAX(ts) as metric_date
FROM dsp_series
GROUP BY entidad_id, platform;
