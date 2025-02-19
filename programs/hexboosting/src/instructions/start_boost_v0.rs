use anchor_lang::prelude::*;
use mobile_entity_manager::CarrierV0;

use crate::{BoostConfigV0, BoostedHexV0};

#[derive(Accounts)]
pub struct StartBoostV0<'info> {
  pub start_authority: Signer<'info>,
  pub boost_config: Box<Account<'info, BoostConfigV0>>,
  #[account(
    has_one = hexboost_authority,
    constraint = carrier.sub_dao == boost_config.sub_dao,
    constraint = carrier.approved,
  )]
  pub carrier: Box<Account<'info, CarrierV0>>,
  pub hexboost_authority: Signer<'info>,
  #[account(
    mut,
    has_one = boost_config,
  )]
  pub boosted_hex: Box<Account<'info, BoostedHexV0>>,
}

pub fn handler(ctx: Context<StartBoostV0>) -> Result<()> {
  let now = Clock::get()?.unix_timestamp;
  ctx.accounts.boosted_hex.start_ts = now;

  Ok(())
}
